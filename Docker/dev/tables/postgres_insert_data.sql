-- Insert sample data into customers table
INSERT INTO adamaurelio.customers (first_name, last_name, email, phone, address, city, state, zip_code, date_of_birth, created_by)
VALUES 
('John', 'Doe', 'john.doe@example.com', '555-1234', '123 Main St', 'Anytown', 'NY', '12345', '1980-01-15', 'admin'),
('Jane', 'Smith', 'jane.smith@example.com', '555-5678', '456 Elm St', 'Othertown', 'CA', '54321', '1985-02-20', 'admin'),
('Alice', 'Johnson', 'alice.johnson@example.com', '555-8765', '789 Maple St', 'Sometown', 'TX', '67890', '1990-03-25', 'admin'),
('Bob', 'Brown', 'bob.brown@example.com', '555-4321', '321 Oak St', 'Thistown', 'FL', '09876', '1975-04-30', 'admin'),
('Carol', 'White', 'carol.white@example.com', '555-6543', '654 Pine St', 'Yourtown', 'WA', '56789', '1995-05-05', 'admin');

-- Insert sample data into resume table
INSERT INTO adamaurelio.resume (customer_id, resume_text, created_by)
VALUES 
(1, 'John Doe Resume Text', 'admin'),
(2, 'Jane Smith Resume Text', 'admin'),
(3, 'Alice Johnson Resume Text', 'admin'),
(4, 'Bob Brown Resume Text', 'admin'),
(5, 'Carol White Resume Text', 'admin');

-- Insert sample data into personal_site table
INSERT INTO adamaurelio.personal_site (customer_id, site_url, created_by)
VALUES 
(1, 'http://johndoe.com', 'admin'),
(2, 'http://janesmith.com', 'admin'),
(3, 'http://alicejohnson.com', 'admin'),
(4, 'http://bobbrown.com', 'admin'),
(5, 'http://carolwhite.com', 'admin');
