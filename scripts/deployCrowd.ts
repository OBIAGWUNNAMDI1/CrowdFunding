// eslint-disable-next-line no-unused-vars
import { ethers, network } from "hardhat";
import { CrowdFund } from "../typechain-types";
async function mainAcc() {
  const contractCreator = "0x2d56dEf1e86b8Ae36F9545F1FD65Bd8cbD1Befef";
  const createProject = {
    goalAmount: "40000000000000000000",
    projectName: "MusicProject",
    fundsRaisingDeadline: 1649686763,
  };
  // @ts-ignore
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [contractCreator],
  });
  const ownerSigner = await ethers.getSigner(contractCreator);
  const Project = await ethers.getContractFactory("CrowdFund", ownerSigner);
  const projectStarted = await Project.deploy();
  await projectStarted.deployed();
  const newproject = await projectStarted.startProject(createProject);
  const projectEvents = await newproject.wait();
  console.log(projectStarted.address);
  console.log(projectEvents.events);
}
mainAcc().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
