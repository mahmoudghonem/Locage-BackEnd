const Store = require("../models/store");
const User = require("../models/user");

//Get all stores
async function getAll(req, res) {
    const { limit } = req.query;
    const { page } = req.query;

    const options = {
        limit: limit || 10,
        page: page || 1,
    };
    return await Store.paginate({}, options)
        .then((result) => {
            return result;
        })
        .catch((err) => {
            res.send(err);
        });
}


//Getone store
async function getOne(req, res) {
    const { id } = req.params;
    const store = await Store.findById(id).exec();
    if (!store)
        return res.sendStatus(404).send("NOT_FOUND");
    else
        return store;
}


//Post one store
async function create(req, res) {
    const { body, file, user } = req;
    let store;
    const getUser = User.findById(user.id);
    if (!getUser)
        return res.sendStatus(401).send("UN_AUTHENTICATED");

    if (getUser.Role != 'vender')
        return res.sendStatus(401).send("UN_AUTHENTICATED");

    if (file) {
        const image = "/images/" + req.file.filename;
        store = await Store.create({ ...body, photo: image }).then((result) => {
            return result;
        }).catch((err) => {
            res.send(err);
        });
    } else {
        store = await Store.create({ ...body })
            .then((result) => {
                return result;
            }).catch((err) => {
                res.send(err);
            });
    }

    return store;

}

//Update one store
async function update(req, res) {
    const { body } = req;
    const { id } = req.params;
    const store = getOne(id);

    if (!store)
        return res.sendStatus(404).send("NOT_FOUND");

    const file = req.file | false;
    if (file) {
        const image = "./images/" + req.file.filename;
        body.photo = image;
        return await Store.findByIdAndUpdate({ id }, { ...body }, { new: true });
    } else {
        return await Store.findByIdAndUpdate(id, body, { new: true });
    }
}


//Delete one store 
async function remove(req, res) {
    const { id } = req.params;
    const store = getOne(id);
    if (!store)
        return res.sendStatus(404).send("NOT_FOUND");
    else
        await Store.findByIdAndDelete(id).exec();
}


//export all functions
module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove
};

