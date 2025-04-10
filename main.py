import os
from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

# Initialize Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev_key")

# Configure the database
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

# Initialize the app with the extension
db.init_app(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/customers', methods=['GET'])
def get_customers():
    from models import Customer
    customers = Customer.query.order_by(Customer.created_at.desc()).all()
    return jsonify([customer.to_dict() for customer in customers])

@app.route('/api/customers', methods=['POST'])
def create_customer():
    from models import Customer
    data = request.json
    
    # Create a new customer
    customer = Customer(
        name=data.get('name'),
        email=data.get('email'),
        phone=data.get('phone'),
        address=data.get('address'),
        landmark=data.get('landmark'),
        instructions=data.get('instructions')
    )
    
    # Add to database
    db.session.add(customer)
    db.session.commit()
    
    return jsonify(customer.to_dict()), 201

@app.route('/api/customers/<int:id>', methods=['GET'])
def get_customer(id):
    from models import Customer
    customer = Customer.query.get_or_404(id)
    return jsonify(customer.to_dict())

@app.route('/api/customers/<int:id>', methods=['DELETE'])
def delete_customer(id):
    from models import Customer
    customer = Customer.query.get_or_404(id)
    db.session.delete(customer)
    db.session.commit()
    return '', 204

# Initialize the database tables
with app.app_context():
    import models
    db.create_all()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
