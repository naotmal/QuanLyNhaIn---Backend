const asyncHandler = require("express-async-handler");
const Client = require("../models/clientModel")

const createClient = asyncHandler (async(req, res)=>{
    const {name, email, phone, address} = req.body

    //validation
    if (!name || !email || !phone || !address){
        res.status(400)
        throw new Error("Please fill in all fields")
    }
    //Create client
    const client = await Client.create({
        user: req.user.id,
        name, email, phone, address,
    });

    res.status(201).json(client)
});

// Get all Clients
const getClients = asyncHandler(async (req, res) => {
    const clients = await Client.find({ user: req.user.id }).sort("-createdAt");
    res.status(200).json(clients);
  });

    //Get single client
const getClient = asyncHandler(async(req, res)=>{
    const client = await Client.findById(req.params.id)
    if(!client){
        res.status(400)
        throw new Error("Client not found")

    }
    if(client.user.toString() !== req.user.id){
        res.status(400)
        throw new Error("User not authorized")
    }
    
    res.status(200).json(client)
});

//Delete client
const deleteClient = asyncHandler(async(req, res)=>{
    const client = await Client.findById(req.params.id)
    if(!client){
        res.status(400)
        throw new Error("Client not found")

    }
    if(client.user.toString() !== req.user.id){
        res.status(400)
        throw new Error("User not authorized")
    }
    await client.deleteOne()
    res.status(200).json({message: "Client deleted"})
});

//Update client
const updateClient = asyncHandler (async(req, res)=>{
    const {name, email, phone, address} = req.body
const {id} = req.params
    const client = await Client.findById(id)
    if(!client){
        res.status(400)
        throw new Error("Client not found")

    }
    if(client.user.toString() !== req.user.id){
        res.status(400)
        throw new Error("User not authorized")
    }

    
    
    //update client
    const updatedClient = await Client.findByIdAndUpdate(
        {_id: id},
        {
            name, email, phone, address
        },
        {
            new: true,
            runValidators: true
        }
    )

    res.status(200).json(updatedClient)
});

module.exports={
    createClient,
    getClients,
    getClient,
    deleteClient,
    updateClient,
}