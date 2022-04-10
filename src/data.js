module.exports = [
    {
        name: "help",
        description: "Prints out some useful help information, for you.",
        category: `misc`
    },
    {
        name: "database",
        description: "Commands to create/manage your Db(s)/Database(s).",
        category: "management",
        options: [
            {
                name: "create",
                description: "Create a new database.",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "name",
                        description: "The name of the database.",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "delete",
                description: "Delete an database.",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "name",
                        description: "The name of the database.",
                        type: "STRING",
                        required: false
                    }
                ]
            },
            {
                name: "view",
                description: "View inside all database(s) or just one.",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "name",
                        description: "The name of the database.",
                        type: "STRING",
                        required: false
                    }
                ]
            },
            {
                name: "add_prop",
                description: "Add a new property to the your database schema.",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "name",
                        description: "The name of the property.",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "type",
                        description: "The type of the property.",
                        type: "STRING",
                        choices: [
                            {
                                name: "Array []",
                                value: "array",
                            },
                            {
                                name: "String \"\"",
                                value: "string",
                            },
                            {
                                name: "Object {}",
                                value: "object",
                            },
                        ],
                        required: true
                    }
                ]
            }
        ],
    }
];