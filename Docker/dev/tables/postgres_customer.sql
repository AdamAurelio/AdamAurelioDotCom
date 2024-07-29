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
CREATE SEQUENCE customer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Create the trigger function to set customer_id
CREATE OR REPLACE FUNCTION set_customer_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.customer_id = nextval('customer_id_seq');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger to call the function before insert
CREATE TRIGGER before_insert_customer
BEFORE INSERT ON customers
FOR EACH ROW
EXECUTE FUNCTION set_customer_id();