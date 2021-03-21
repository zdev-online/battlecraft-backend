const symbols  = "abcdefghijklmnopqrstuvwxyz0123456789";

async function generate(UserModel){
    let ref_code    = "";
    for(let i = 0; i < 8; i++){
        ref_code += symbols[Math.floor(Math.random() * symbols.length)];
    }
    let isNotFree   = await UserModel.findOne({ where: { ref_code } });
    return isNotFree ? generate(UserModel) : ref_code; 
}

module.exports = generate;
