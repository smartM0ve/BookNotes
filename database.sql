CREATE TABLE books (
	id SERIAL PRIMARY KEY,
	title VARCHAR(200) NOT NULL,
	note TEXT,
	rating INT,
	read_date DATE,
	cover_link VARCHAR(200)
);

CREATE TABLE books (
	id SERIAL PRIMARY KEY,
	title VARCHAR(200) NOT NULL,
	author VARCHAR(100),
	date_read DATE,
	date_created DATE,
	date_modified DATE,
	note TEXT,
	rating INT,
	isbn VARCHAR(15),
	cover_id VARCHAR(20)
);

-- CREATE
INSERT INTO books(title, author, date_read, date_created, date_modified, note, rating, isbn, cover_id)
VALUES ('O homem que calculava', 'Malba Tahan', '2007-01-01', current_date, current_date, 'Livro muito bom. Matemática interessante', 5, '', '14512053')
-- INSERT INTO books(title, note, rating, read_date, cover_link)
-- VALUES ('O homem que calculava', 'Livro muito bom. Matemática interessante', 5, '2007-01-01', 'https://covers.openlibrary.org/b/id/14512053-L.jpg')
-- INSERT INTO books(title, note, rating, read_date, cover_link)
-- VALUES ('Harry Potter e a Pedra Filosofal', 'My notes of the book', 5, '2010-05-01', 'https://covers.openlibrary.org/b/id/14512053-L.jpg')

VALUES('Sapiens','Yuval Noah Harari','2020-01-01',current_date, current_date,'"Sapiens: A Brief History of Humankind"* by Yuval Noah Harari is a thought-provoking exploration of human history. The book delves into the evolution of Homo sapiens, from our early ancestors to modern society. Harari blends history, science, and philosophy to explore how humans have shaped the world through agriculture, capitalism, and industrialization. His narrative is engaging, offering profound insights into the forces that have driven human progress and conflict. The book challenges traditional views of history, prompting readers to question ideas of human superiority and progress. Harari''s writing is accessible and captivating, making complex concepts easy to grasp. However, some readers may find his conclusions controversial or overly generalized. Still, *Sapiens* offers a fascinating lens through which to understand the past, present, and future of humankind. It’s a book that encourages deep reflection on the path humanity has taken and where it''s headed. Highly recommended for anyone interested in history, anthropology, or sociology. By ChatGPT',5,'',12919088)
VALUES('Misbehaving','Richard H. Thaler','2025-01-29',current_date, current_date,'"Misbehaving: The Making of Behavioral Economics" by Richard H. Thaler is an insightful and engaging exploration of how human behavior often deviates from traditional economic models. Thaler, a pioneer in the field, takes readers through the evolution of behavioral economics with humor and clarity. The book challenges the assumption that people always act rationally, highlighting how biases, emotions, and social influences shape decision-making. Thaler’s writing is accessible, making complex concepts understandable for a general audience. The real-world examples bring theory to life, showing how behavioral insights have practical applications in areas like policy and finance. Overall, &lt;em&gt;Misbehaving&lt;/em&gt; is both informative and thought-provoking, offering a fresh perspective on economic theory and human nature. By ChatGPT',4,'',8270508)

-- read
select id, title, author, date_read, date_created, date_modified, note, rating, isbn, cover_id from books
order by rating desc, title, read_date	-- only one by query

-- update
update books
set title = '',
	author = '',
	date_read = current_date,
	--date_created,
	date_modified = current_date,
	note = '',
	rating = 5,
	isbn = '',
	cover_id = ''
where id = 1;

-- delete
delete books
where id = 1