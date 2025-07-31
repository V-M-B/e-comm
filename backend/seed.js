const fs = require('fs');
const csv = require('csv-parser');
const { sequelize, Product, Department } = require('./database');

const loadData = async () => {
  const productsData = [];
  const departments = new Map(); // Use a Map to store unique departments

  fs.createReadStream('products.csv')
    .pipe(csv())
    .on('data', (row) => {
      productsData.push(row);
      if (!departments.has(row.department)) {
        departments.set(row.department, { name: row.department });
      }
    })
    .on('end', async () => {
      try {
        await sequelize.sync({ force: true });

        // Create departments
        const createdDepartments = await Department.bulkCreate(
          Array.from(departments.values()),
          { returning: true }
        );

        // Map department names to their IDs for easy lookup
        const departmentMap = new Map();
        createdDepartments.forEach(dep => departmentMap.set(dep.name, dep.id));

        // Prepare products with the correct DepartmentId
        const productsToCreate = productsData.map(p => ({
          name: p.name,
          price: p.price,
          DepartmentId: departmentMap.get(p.department),
        }));
        
        await Product.bulkCreate(productsToCreate);

        console.log('✅ Database refactored and seeded successfully.');
      } catch (error) {
        console.error('Error seeding database:', error);
      }
    });
};

loadData();