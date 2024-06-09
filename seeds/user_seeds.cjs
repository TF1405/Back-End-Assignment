const bcrypt = require('bcryptjs');

exports.seed = async knex => {
    await knex("users").del()

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash("secured password", salt)

    await knex("users").insert([
        {name: "John", email: "john@email.com", password: hashedPassword},
        {name: "Bob", email: "bob@email.com", password: hashedPassword},
    ])
}
