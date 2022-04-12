// eslint-disable-next-line no-unused-vars
import { ethers, network } from "hardhat";
import { ProjectCreated } from "../typechain-types";
async function mainAcc() {
  // 0x2d56dEf1e86b8Ae36F9545F1FD65Bd8cbD1Befef
  // 0xaDaf70908E510927989555B478e77f1F83023059
  // 0x4E972FfE683a9764fC341239FaF21e16dCcd8819
  // 0x90bf77bec0F1e454874360549A863Cf578E2E00E
  // 0xc9553Bf24Bd30fF5fC359259C519F863b605548c
  // 0x803E9e437beBfBDEbe1A67334A1c34FA78aE3c60

  const contractCreator = "0x2d56dEf1e86b8Ae36F9545F1FD65Bd8cbD1Befef";
  // @ts-ignore
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [contractCreator],
  });
  const ownerSigner = await ethers.getSigner(contractCreator);
  const Projects = await ethers.getContractFactory(
    "ProjectCreated",
    ownerSigner
  );
  const ProjectStarted = await Projects.deploy(
    "0x2d56dEf1e86b8Ae36F9545F1FD65Bd8cbD1Befef",
    "MusicProject"
  );
  await ProjectStarted.deployed();
  console.log(ProjectStarted.address);
}
mainAcc().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
