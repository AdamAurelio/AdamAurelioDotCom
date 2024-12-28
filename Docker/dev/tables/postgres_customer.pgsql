-- Create schema
CREATE SCHEMA adamaurelio;

-- Create customers table in the adamaurelio schema
CREATE TABLE adamaurelio.customers (
    customer_id INT PRIMARY KEY DEFAULT nextval('adamaurelio.customer_id_seq'),
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

-- Create the sequence for customer_id in the adamaurelio schema
CREATE SEQUENCE adamaurelio.customer_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 99999999999999999999999999999
    CACHE 1;

-- Create resume table
CREATE TABLE adamaurelio.resume (
    resume_id INT PRIMARY KEY DEFAULT nextval('adamaurelio.resume_id_seq'),
    customer_id INT REFERENCES adamaurelio.customers(customer_id),
    resume_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the sequence for resume_id
CREATE SEQUENCE adamaurelio.resume_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 99999999999999999999999999999
    CACHE 1;

-- Create personal_site table
CREATE TABLE adamaurelio.personal_site (
    site_id INT PRIMARY KEY DEFAULT nextval('adamaurelio.site_id_seq'),
    customer_id INT REFERENCES adamaurelio.customers(customer_id),
    site_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the sequence for site_id
CREATE SEQUENCE adamaurelio.site_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 99999999999999999999999999999
    CACHE 1;

-- Create roles
CREATE ROLE admin;
CREATE ROLE readonly;

-- Grant privileges
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA adamaurelio TO admin;
GRANT SELECT ON ALL TABLES IN SCHEMA adamaurelio TO readonly;