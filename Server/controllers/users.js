const getusers = ((req, res) => {
    res.json(users)
})

const getuser = ((req, res) => {
    const user = users.find(user => user.id === id)
        if (!user) {
        return res.status(404).send('user not found')
    }
    res.json(user)
})

const createuser = ((req, res) => {
    const newuser = {
        name: req.body.username,
    }
    users.push(newuser)
    res.status(201).json(newuser)
})

const updateuser = ((req, res) => {
    const index = users.findIndex(user => user.id === id)
    const updateduser = {
        id: users[index].id,
        name: req.body.username,
    }

    users[index] = updateduser
    res.status(200).json('user updated')
})

const deleteuser = ((req, res) => {
    const index = users.findIndex(user => user.id === id)
    users.splice(index,1)
    res.status(200).json('user deleted')
})

module.exports = {
    getusers,
    getuser,
    createuser,
    updateuser,
    deleteuser
}

