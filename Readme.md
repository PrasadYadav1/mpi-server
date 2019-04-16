```bash
$ git clone https://gitlab.com/technoidentity/mpi_server.git
$ cd mpi_server
```

\$ Install dependencies:

```bash
   $ npm install (only in development)

   $ npm install --only=prod(use in demo environment or in prod.. dont use npm install)
```

Start the server:

```bash
   $ npm start
```

Start the server in dev mode:

```bash
   $ npm run dev-start
```

\$ To run table creation

```bash
$ node_modules/.bin/sequelize  model:create --name products --attributes name:String,companyName:String,injectionType:String,formType:String,packSize:String,createdBy:integer,updatedBy:Integer,isActive:Boolean
```

\$ To run seed data

```bash
$ node_modules/.bin/sequelize db:seed --seed <file-name>
```

\$ Users seed data

```bash
$ node_modules/.bin/sequelize db:seed --seed 20170914122520-seed-users
```

\$ To run undo tables data

```bash
$ node_modules/.bin/sequelize db:migrate:undo <file-name>
```
