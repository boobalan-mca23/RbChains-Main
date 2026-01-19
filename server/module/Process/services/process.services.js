const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAll_lotProcess_Service=async()=>{

      const allProcess=await prisma.lotProcess.findMany()
      const modify=allProcess.filter((item,_)=>item.process_name!=="scarpGold")
      return modify
}
