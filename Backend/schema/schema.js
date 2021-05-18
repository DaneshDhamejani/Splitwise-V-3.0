const graphql = require('graphql');
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

const User = require("../models/User");
const Group = require("../models/Group");
const Bill = require("../models/Bills");
const Transaction = require("../models/Transaction");

const bcrypt = require("bcryptjs");







const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;


const UserType = new GraphQLObjectType({
    name: 'User',
    fields: ( ) => ({
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLNonNull(GraphQLString) },
        date: { type: GraphQLString },
        profileImg: { type: GraphQLString },
        groups_added: { type: GraphQLString },
        groups_invited: { type: GraphQLString },
        users_except_self: { type: GraphQLList(GraphQLString) },
        user_found: { type: GraphQLList(GraphQLString) },
        token: { type: GraphQLString }
        

        
    })
});

const GroupType = new GraphQLObjectType({
    name: 'Group',
    fields: ( ) => ({
        groupname: { type: GraphQLString },
        date: { type: GraphQLString },
        grouppic: { type: GraphQLString },
        bills: { type: GraphQLString },
        groupmembers: { type: GraphQLString },
        groupmembersacceptinvite: { type: GraphQLString },
        groupmemberemails: { type: GraphQLList(GraphQLString) },
        leavegroupmessage: { type: GraphQLString },
        groupsaccepted: { type: GraphQLList(GraphQLString) },
        group_status: { type: GraphQLString }
    })
});

const BillType = new GraphQLObjectType({
    name: 'Bill',
    fields: ( ) => ({
        billamount: { type: GraphQLInt },
        billdate: { type: GraphQLString },
        billcreatedby: { type: GraphQLString },
        billdescription: { type: GraphQLString },
        groupname: { type: GraphQLString },
        billcomments: { type: GraphQLString },
        
    })
});


const TransactionType = new GraphQLObjectType({
    name: 'Transaction',
    fields: ( ) => ({
        splitamount: { type: GraphQLInt },
        sender: { type: GraphQLString },
        receiver: { type: GraphQLString },
        all_stats_user: { type: GraphQLList(GraphQLString) },
        
    })
});










    const RootQuery = new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
            getnamefordashboard: {
                type: UserType,
                args: { 
                    useremail: { type: GraphQLString },
                    
                },
                async resolve(parent, args){
                    console.log("Inside Get username Post Request");
                    useremail = args.useremail
                    console.log(useremail)
                    const dashboardname= await User.find({email:useremail},{name:1});
                    console.log(dashboardname)
                    return dashboardname[0]
                }
            },

            all_users_exceptself:
            {
                type: UserType,
                args: { 
                    useremail: { type: GraphQLString },
                    
                },
                async resolve(parent,args){
                    console.log("Hell oWorl");
                    console.log(reactselectquery(args));
                    return reactselectquery(args);
                }
            },
        allstats:
        {
            type: TransactionType,
            args: { 
                useremail: { type: GraphQLString },
                
            },
            async resolve(parent,args){
                console.log("Yolo!");
                console.log(all_stats(args));
                return all_stats(args);
            }
        },
        getgroupmemberemails:
        {
            type: GroupType,
                args: { 
                    groupname: { type: GraphQLString },
                    
                },
                async resolve(parent, args){
                    console.log("Inside Get Group member emails Request");
                    groupname = args.groupname
                    const allemails= await Group.find({"groupname":groupname},{groupmembersacceptinvite:1});
                    console.log(allemails[0].groupmembersacceptinvite)
                    var emails=allemails[0].groupmembersacceptinvite
                    return {groupmemberemails:emails}
        }
    },
    leavegroup:
    {
        type: GroupType,
            args: { 
                groupname: { type: GraphQLString },
                useremail: {type:GraphQLString },
            },
            async resolve(parent, args){
                var useremail=args.useremail
                var groupname=args.groupname
                await Group.updateOne({"groupname":groupname},{$pull:{"groupmembersacceptinvite":useremail}})
                await User.updateOne({"email":useremail},{$pull:{"groups_added":groupname}})
               return {leavegroupmessage:"User removed successfully"}
            }
},
getallgroupsaccepted:
{
    type: GroupType,
        args: { 
            useremail: {type:GraphQLString },
        },
        async resolve(parent, args){
            var useremail=args.useremail
            const allgroups= await User.find({email:useremail},{groups_added:1});
            return {groupsaccepted:allgroups}
        }
},
login:
{
    type: UserType,
        args: { 
            email: {type:GraphQLString },
            password: {type:GraphQLString }
        },
        async resolve(parent,args){
            console.log("Hello world");
            console.log(loginquery(args));
            return await loginquery(args);
        }
        
            
                
       
        },
        getallbills:
        {
        type: GraphQLList(BillType),
        args: { 
            groupname: {type:GraphQLString },
           
        },
        async resolve(parent,args){
            groupname=args.groupname
            const allbillsinfo= await Bill.find({"groupname":groupname},{billamount:1,billdescription:1,_id:1,billcomments:1});
            console.log(allbillsinfo)
            return (allbillsinfo)
                
        }
        }


    }
})
    


const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        signup: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString },
                name: { type: GraphQLString },
            }, 
            async resolve(parent, args){
            console.log("Hello world");
            console.log(signupquery(args));
            return await signupquery(args);
                
    }
},
add_group:
{
    type: GroupType,
            args: {
                useremail: { type: GraphQLString },
                groupname: { type: GraphQLString },
                
                groupmemberemails:{ type: GraphQLList(GraphQLString) }
            }, 
            async resolve(parent, args){
                console.log("Hello world");
                //console.log(addgroup(args));
                return await addgroup(args);
                    
        }
}
    }
})


const addgroup = (args) => {
    return new Promise(async (resolve,reject)=>{
            let groupname=args.groupname
            console.log("Inside Create Group Post Request");
            const groupExists = await Group.findOne({ groupname:groupname });
            if (groupExists) 
            resolve({group_status:"Group already exists!"})
            
            var useremail=args.useremail
            groupmemberemails = args.groupmemberemails
            groupmemberemails.push(useremail)
            
            
            console.log(useremail)
            
            
            console.log(groupname)
            console.log(groupmemberemails)
            var groupmembersbeforeinvite = []
            var groupmembersaccepted=[]
            
            for (var i = 0; i < groupmemberemails.length; i++) {
                console.log(groupmemberemails[i])
                if(groupmemberemails[i]!=useremail)
                {
                groupmembersbeforeinvite.push(groupmemberemails[i])
                }
                else
                {
                    groupmembersaccepted.push(groupmemberemails[i])
                }
            }
            console.log(groupmembersbeforeinvite)
            console.log(groupmembersaccepted)
            const group= new Group();
            group.groupname=groupname
            group.groupmembers=groupmembersbeforeinvite
            group.groupmembersacceptinvite=groupmembersaccepted
        
            await User.updateOne({"email":useremail},{$push:{"groups_added":groupname}})
            
            for(let i=0;i<groupmembersbeforeinvite.length;i++)
            {
                await User.updateOne({"email":groupmembersbeforeinvite[i]},{$push:{"groups_invited":groupname}})
            }
            
            await group.save()
            resolve({group_status:"Group created successfully!"})
        

    })

}







const signupquery = (args) => {
    return new Promise(async (resolve,reject)=>{
        console.log("Inside signup")
                email=args.email
                password=args.password
                name=args.name
                await User.findOne({ email: email }).then(user => {
                    if (user) {
                        console.log("Got user")
                      resolve ({token:"Email already exists"});
                    } else {
                        console.log("There is no existing user")
                      const newUser = new User({
                        name: name,
                        email: email,
                        password: password
                      });
                      console.log("Saved user")
                      bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                          if (err) throw err;
                          newUser.password = hash;
                          newUser
                            .save()
                            resolve ({token:"User saved!"})
                    })
                })
            }
        })
                        

    })

}






    const loginquery = (args) => {
        return new Promise(async (resolve,reject)=>{
            console.log("Inside login")
            email=args.email
            password=args.password
            console.log("Got email",email)
            console.log("Got password",password)
            User.findOne({ email }).then(user => {
                console.log("User details",user)
                if(!user)
                {
                    resolve ({token:"User not present!"})
                }
                bcrypt.compare(password, user.password).then(isMatch => {
                    if (isMatch) {
                        console.log("Found user")
                        resolve ({token:"User present"})
                    }
                })

            })
                            

        })
    
    }

    const reactselectquery = (args) => {
    return new Promise(async (resolve,reject)=>{
        useremail = args.useremail
                        
                        const allemails= await User.find({},{"email":1});
                        
                        all_users=[]
                        for(let i=0;i<allemails.length;i++)
                        {
                          var currentemail=allemails[i].email
                          //console.log(currentemail)
                          if(currentemail!=useremail)
                          {
                            all_users.push(currentemail)
                          }
                        }
                       // console.log("ALL USERS EXCEPT SELF",all_users)
                        
                         resolve({users_except_self:  all_users});
    })

}

const all_stats = (args) => {
    return new Promise(async (resolve,reject)=>{
    
        console.log("Inside All Stats")
        var useremail=args.useremail
 
 
 
 
         let owe= await Transaction.aggregate([
             {$match:{"receiver":useremail}},
             {$group : {"_id": "$sender", "splitamount":{$sum:"$splitamount"}}}
          
          ])
 
 
         let owed= await Transaction.aggregate([
             {$match:{"sender":useremail}},
             {$group : {"_id": "$receiver", "splitamount":{$sum:"$splitamount"}}}
          
          ])
 
 
 
          let updatedowe=[]
          for(let i=0;i<owe.length;i++)
          {
             updatedowe.push({"_id":owe[i]._id,"splitamount":owe[i].splitamount*-1})
          }
 
          console.log("Owe:",updatedowe)
          console.log("Owed:",owed)
 
          let overall_array=[]
          let only_owe=[]
          let only_owed=[]
          let temp_emails=[]
 
       
 
 
          for(let i=0;i<updatedowe.length;i++)
          {
              let current_owe=updatedowe[i]
              for(let j=0;j<owed.length;j++)
              {
                  let current_owed=owed[j]
                  if(current_owe._id==current_owed._id)
                  {
                     overall_array.push({"_id":current_owe._id,"splitamount":current_owe.splitamount+current_owed.splitamount})
                     temp_emails.push(current_owe._id)
                  }
              }
          }
          console.log("Overall array:",overall_array)
          console.log("Temp emails:",temp_emails)
          
          
          for(let i=0;i<updatedowe.length;i++)
          {
              if(!temp_emails.includes(updatedowe[i]._id))
              {
                 overall_array.push(updatedowe[i])
              }
          }
         console.log("Overall array updated1:",overall_array)
 
         for(let i=0;i<owed.length;i++)
          {
              if(!temp_emails.includes(owed[i]._id))
              {
                 overall_array.push(owed[i])
              }
          }
          
          console.log("Overall array updated2:",overall_array)
          
          
                        
    resolve({all_stats_user: overall_array[0]});
    })

}
            
            
        

    

       





module.exports = new GraphQLSchema({
            query: RootQuery,
            mutation:Mutation
            
        });












