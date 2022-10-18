create database restpractice;
use restpractice;

create table works(
		id int auto_increment not null,
        tarea varchar(30) not null,
        estado char(1),
		constraint works_pk primary key(id)
);

alter table works add(fecha varchar(10));
	
select * from works;