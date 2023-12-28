create database pdv;

use pdv;

create table usuarios (
    id serial primary key not null,
    nome varchar(255) not null,
    email varchar(255) unique not null,
    senha varchar(255) not null
);

create table categorias (
    id serial primary key not null,
    descricao varchar(255) not null
);

insert into categorias (descricao)
values 
	('Informática'),
	('Celulares'),
	('Beleza e Perfumaria'),
	('Mercado'),
	('Livros e Papelaria'),
	('Brinquedos'),
	('Moda'),
	('Bebê'),
	('Games');

create table produtos (
	id serial primary key not null,
	descricao text,
  	quantidade_estoque integer,
  	valor integer,
  	categoria_id integer references categorias(id)
);

create table clientes (
    id serial primary key not null,
    nome text not null,
    email text unique not null,
    cpf varchar(11) unique not null,
    cep varchar(8),
    rua text,
    numero text,
    bairro text,
    cidade text,
    estado text
);

create table pedidos (
	id serial primary key not null,
	valor_total integer,
	observacao text,
	cliente_id integer references clientes(id)
);

create table pedido_produtos (
	id serial primary key not null,
	quantidade_produto integer,
    valor_produto integer,
	pedido_id integer references pedidos(id),
	produto_id integer references produtos(id)
);

alter table produtos
add column produto_imagem text;









