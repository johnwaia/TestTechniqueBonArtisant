
const getcontacts = ((req, res) => {
    res.json(contacts)
})

const getcontact = ((req, res) => {
    const contact = contacts.find(contact => contact.id === id)

        if (!contact) {
        return res.status(404).send('contact not found')
    }
    res.json(contact)
})

const createcontact = ((req, res) => {
    const newcontact = {
        name: req.body.contactname,
        phone: req.body.contactPhone,
        firstname: req.body.contactFirstname,
        createdby: req.body.createdby,
    }
    contacts.push(newcontact)
    res.status(201).json(newcontact)
})

const updatecontact = ((req, res) => {
    const index = contacts.findIndex(contact => contact.id === id)
    const updatedcontact = {
        id: contacts[index].id,
        name: req.body.contactname,
        phone: req.body.contactPhone,
        firstname: req.body.contactFirstname,
        createdby: req.body.createdby,
    }

    contacts[index] = updatedcontact
    res.status(200).json('contact updated')
})

const deletecontact = ((req, res) => {
    const index = contacts.findIndex(contact => contact.id === id)
    contacts.splice(index,1)
    res.status(200).json('contact deleted')
})

module.exports = {
    getcontacts,
    getcontact,
    createcontact,
    updatecontact,
    deletecontact
}

