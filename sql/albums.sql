-- \i /home/globik/alikon/sql/albums.sql

alter table albums drop constraint unique_title;
drop table albums;
create table albums(id varchar(24) not null default generate_object_id(),
							   title varchar(255) not null,
                                                           us_id text,
                                                          description text not null default 'description',
							   us_data jsonb,
							   created timestamp not null default now(),
				                           constraint unique_title unique(title)
);

insert into albums(title, us_id, us_data) values ('mama','ffd32wdr','{}');


--update albums set us_data = jsonb_set(us_data::jsonb, '[{"src1":"/src1.png","src2":"/src2.png","src3":"/src3.png","src4":"/src4.png","title":"some title"}]');
--update albums set us_data=us_data || '[{"src1":"/rc1.png","src2":"/rc2.png","src3":"/rc3.png","src4":"/rc4.png","title":" title"},{"src1":"/b1.png","src2":"/b2.png","src3":"/b3.png","src4":"/b4.png","title":"BB title"}]' where title='mama';
update albums set 

