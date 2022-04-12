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
  const contractCreator = "0x4E972FfE683a9764fC341239FaF21e16dCcd8819";
  // @ts-ignore
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [contractCreator],
  });
  const ownerSigner = await ethers.getSigner(contractCreator);
  const ThetaAddress = "0x3883f5e181fccaF8410FA61e12b59BAd963fb645";

  // creating an instance of the theta coin.
  const ThetaContract = await ethers.getContractAt(
    "IERC20",
    ThetaAddress,
    ownerSigner
  );

  // creating an instance of the depolyed contract.
  const projectAddress = "0x903665b2AAD55ECf0172DBd2140b3AfF54B50f16";
  const Projects = await ethers.getContractAt(
    "ProjectCreated",
    projectAddress,
    ownerSigner
  );
  await Projects.deployed();

  // allow the contract addresss to spend the token.
  await ThetaContract.allowance(contractCreator, projectAddress);
  await ThetaContract.approve(projectAddress, "300000000000000000000");
  console.log("boy");
  const contribution = await Projects.contributeFunds("1000000000000000000000");
  console.log("boy2");
  const contributions = await contribution.wait();
  console.log(Projects.address);
  console.log(contributions.events);
}
mainAcc().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
