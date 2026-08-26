const conversation = require("../models/conversation.js")
const User = require("../models/user.js")


async function createConversation(req, res) {
    const { title, subject, language } = req.body;

    const user_id = req.user.id;

    const conversation = new Conversation({
        user_id,
        title,
        subject,
        language
    });

    await conversation.save();

    res.status(201).json({
        success: true,
        message: "New conversation created",
        conversation
    });
}

async function getConversations(req,res){
    const user_id = req.user.id
    
    const All = await find({student_id:user_id});
    
    if(All.length ==0){
        return res.status(404).json({
            success:false,
            message:"No conversations found"
        })
    }

    res.status(201).json({
        success:true,
        All,
    })
}


async function getConversation(req,res){
    const {id} = req.params;

    const oneConversation = await conversation.findById(id)
    if(!oneConversation){
        return res.status(404).json({
            success:false,
            message:"Conversation not found"
        })
    }

    res.status(200).json({
        success:true,
        oneConversation,
    })


}

async function DeleteConversation(req,res){
    const {id} = req.params;
    const oneConvo = await conversation.findAndDeleteById(id);
    if(!oneConvo){
        return res.status(404).json({
            success:false,
            message:"Conversation not found"
        })
    }

    res.status(200).json({
        status:true,
        message:"Conversation successfully deletd"
    })

}

async function UpdateConversation(req,res){
    const {id} = req.params;
    const convo = await conversation.findByIdAndUpdate(id,req.body)
    if(!convo){
        return res.status(404).json({
            success:false,
            message:"Conversation not found"
        })
    }
    res.status(200).json({
        success:true,
        message:"conversation successfully updated",
        convo
    })
}

module.exports = {createConversation,getConversations,getConversation,DeleteConversation,UpdateConversation}