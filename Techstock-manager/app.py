from flask import Flask, render_template, request, redirect, url_for, flash
import sqlite3
from pathlib import Path

app = Flask(__name__)
app.secret_key = "techstock_chave_local"

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "techstock.db"


# CONEXÃO COM O BANCO
def conectar():
    conexao = sqlite3.connect(DB_PATH)
    conexao.row_factory = sqlite3.Row
    conexao.execute("PRAGMA foreign_keys = ON")
    return conexao


# CRIAR BANCO AUTOMATICAMENTE
def inicializar_banco():
    conexao = conectar()

    with open(BASE_DIR / "database.sql", "r", encoding="utf-8") as arquivo:
        conexao.executescript(arquivo.read())

    conexao.close()


# PÁGINA INICIAL - DASHBOARD
@app.route("/")
def index():
    conexao = conectar()

    produtos = conexao.execute("""
        SELECT
            p.*,
            c.nome AS categoria,
            f.razao_social AS fornecedor
        FROM produtos p
        INNER JOIN categorias c ON p.categoria_id = c.id
        INNER JOIN fornecedores f ON p.fornecedor_id = f.id
        WHERE p.ativo = 1
        ORDER BY p.nome
    """).fetchall()

    conexao.close()

    return render_template("index.html", produtos=produtos)


# CADASTRAR PRODUTO
@app.route("/cadastro", methods=["GET", "POST"])
def cadastro():
    conexao = conectar()

    categorias = conexao.execute(
        "SELECT * FROM categorias ORDER BY nome"
    ).fetchall()

    fornecedores = conexao.execute(
        "SELECT * FROM fornecedores ORDER BY razao_social"
    ).fetchall()

    if request.method == "POST":
        try:
            dados = (
                request.form["sku"].strip(),
                request.form["nome"].strip(),
                request.form["fabricante"].strip(),
                request.form["classificacao"],
                request.form["especificacao"].strip(),
                request.form["modalidade"].strip() or None,
                float(request.form["valor"]),
                int(request.form["estoque"]),
                int(request.form["estoque_minimo"]),
                request.form["localizacao"].strip(),
                int(request.form["categoria_id"]),
                int(request.form["fornecedor_id"])
            )

            if not dados[0] or not dados[1] or not dados[2]:
                raise ValueError("Preencha os campos obrigatórios.")

            if dados[6] <= 0 or dados[7] < 0 or dados[8] < 0:
                raise ValueError("Confira o preço e as quantidades.")

            conexao.execute("""
                INSERT INTO produtos (
                    sku, nome, fabricante, classificacao,
                    especificacao, modalidade_licenciamento,
                    valor_unitario, estoque, estoque_minimo,
                    localizacao, categoria_id, fornecedor_id
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, dados)

            conexao.commit()
            flash("Produto cadastrado com sucesso!", "sucesso")
            return redirect(url_for("index"))

        except sqlite3.IntegrityError:
            conexao.rollback()
            flash("SKU já cadastrado ou associação inválida.", "erro")

        except (ValueError, KeyError):
            conexao.rollback()
            flash("Verifique os campos e informe valores válidos.", "erro")

    conexao.close()

    return render_template(
        "cadastro.html",
        categorias=categorias,
        fornecedores=fornecedores
    )


# REGISTRAR ENTRADA OU SAÍDA
@app.route("/movimentacao", methods=["GET", "POST"])
def movimentacao():
    conexao = conectar()

    produtos = conexao.execute("""
        SELECT id, sku, nome, estoque
        FROM produtos
        WHERE ativo = 1
        ORDER BY nome
    """).fetchall()

    if request.method == "POST":
        try:
            produto_id = int(request.form["produto_id"])
            tipo = request.form["tipo"]
            quantidade = int(request.form["quantidade"])
            observacao = request.form["observacao"].strip()

            if tipo not in ("Entrada", "Saida"):
                raise ValueError()

            if quantidade <= 0:
                raise ValueError()

            conexao.execute("BEGIN")

            produto = conexao.execute("""
                SELECT estoque FROM produtos
                WHERE id = ? AND ativo = 1
            """, (produto_id,)).fetchone()

            if produto is None:
                raise ValueError("Produto não encontrado.")

            saldo = produto["estoque"]

            if tipo == "Saida" and quantidade > saldo:
                raise ValueError(
                    f"Estoque insuficiente! Saldo disponível: {saldo}."
                )

            if tipo == "Entrada":
                novo_saldo = saldo + quantidade
            else:
                novo_saldo = saldo - quantidade

            conexao.execute("""
                UPDATE produtos
                SET estoque = ?
                WHERE id = ?
            """, (novo_saldo, produto_id))

            conexao.execute("""
                INSERT INTO movimentacoes
                (produto_id, tipo, quantidade, observacao)
                VALUES (?, ?, ?, ?)
            """, (produto_id, tipo, quantidade, observacao))

            conexao.commit()
            flash("Movimentação registrada com sucesso!", "sucesso")
            return redirect(url_for("index"))

        except ValueError as erro:
            conexao.rollback()
            flash(str(erro) or "Informe valores válidos.", "erro")

        except (sqlite3.Error, KeyError):
            conexao.rollback()
            flash("Não foi possível registrar a movimentação.", "erro")

    conexao.close()

    return render_template("movimentacao.html", produtos=produtos)


# DESATIVAR PRODUTO
@app.route("/desativar/<int:id>", methods=["POST"])
def desativar(id):
    conexao = conectar()

    conexao.execute("""
        UPDATE produtos SET ativo = 0 WHERE id = ?
    """, (id,))

    conexao.commit()
    conexao.close()

    flash("Produto desativado com sucesso!", "sucesso")
    return redirect(url_for("index"))


# EXCLUIR CATEGORIA COM PROTEÇÃO
@app.route("/excluir-categoria/<int:id>", methods=["POST"])
def excluir_categoria(id):
    conexao = conectar()

    try:
        conexao.execute("DELETE FROM categorias WHERE id = ?", (id,))
        conexao.commit()
        flash("Categoria excluída.", "sucesso")

    except sqlite3.IntegrityError:
        conexao.rollback()
        flash("Não é possível excluir: existem produtos nesta categoria.", "erro")

    finally:
        conexao.close()

    return redirect(url_for("index"))


# EXCLUIR FORNECEDOR COM PROTEÇÃO
@app.route("/excluir-fornecedor/<int:id>", methods=["POST"])
def excluir_fornecedor(id):
    conexao = conectar()

    try:
        conexao.execute("DELETE FROM fornecedores WHERE id = ?", (id,))
        conexao.commit()
        flash("Fornecedor excluído.", "sucesso")

    except sqlite3.IntegrityError:
        conexao.rollback()
        flash("Não é possível excluir: existem produtos vinculados a este fornecedor.", "erro")

    finally:
        conexao.close()

    return redirect(url_for("index"))


if __name__ == "__main__":
    inicializar_banco()
    app.run(debug=True)