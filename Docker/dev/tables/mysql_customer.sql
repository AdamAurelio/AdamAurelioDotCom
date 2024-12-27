-- Create the customers table
CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    date_of_birth DATE,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the sequence for customer_id
CREATE SEQUENCE customer_seq
START WITH 1
INCREMENT BY 1;

-- Create the trigger to auto-increment customer_id
CREATE TRIGGER before_insert_customer
BEFORE INSERT ON customers
FOR EACH ROW
BEGIN
    SELECT customer_seq.NEXTVAL INTO :NEW.customer_id FROM dual;
END;

-- Create the customer_logs table
CREATE TABLE customer_logs (
    log_id INT PRIMARY KEY,
    customer_id INT,
    log_message VARCHAR(255),
    log_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the sequence for log_id
CREATE SEQUENCE log_seq
START WITH 1
INCREMENT BY 1;

-- Create the trigger to auto-increment log_id
CREATE TRIGGER before_insert_customer_log
BEFORE INSERT ON customer_logs
FOR EACH ROW
BEGIN
    SELECT log_seq.NEXTVAL INTO :NEW.log_id FROM dual;
END;

-- Create the after insert trigger to log customer additions
CREATE TRIGGER after_insert_customer
AFTER INSERT ON customers
FOR EACH ROW
BEGIN
    INSERT INTO customer_logs (log_id, customer_id, log_message)
    VALUES (log_seq.NEXTVAL, :NEW.customer_id, CONCAT('Customer ', :NEW.first_name, ' ', :NEW.last_name, ' added.'));
END;

-- Insert sample data into the customers table
INSERT INTO customers (first_name, last_name, email, phone, address, city, state, zip_code, date_of_birth)
VALUES 
('John', 'Doe', 'john.doe@example.com', '555-1234', '123 Main St', 'Anytown', 'NY', '12345', '1980-01-15'),
('Jane', 'Smith', 'jane.smith@example.com', '555-5678', '456 Elm St', 'Othertown', 'CA', '54321', '1985-02-20'),
('Alice', 'Johnson', 'alice.johnson@example.com', '555-8765', '789 Maple St', 'Sometown', 'TX', '67890', '1990-03-25'),
('Bob', 'Brown', 'bob.brown@example.com', '555-4321', '321 Oak St', 'Thistown', 'FL', '09876', '1975-04-30'),
('Carol', 'White', 'carol.white@example.com', '555-6543', '654 Pine St', 'Yourtown', 'WA', '56789', '1995-05-05');
