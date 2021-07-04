const tencentcloud = require("tencentcloud-sdk-nodejs");
const LighthouseClient = tencentcloud.lighthouse.v20200324.Client;
const exec = require('child_process').exec;

const clientConfig = {
  credential: {
    secretId: "AKIDay6yeXXXXastc5",//需要替换成你的secretId
    secretKey: "ECtJSKvFXXXXXXQkob8NL",//需要替换成你的secretKey
  },
  region: "ap-shanghai",
  profile: {
    httpProfile: {
      endpoint: "lighthouse.tencentcloudapi.com",
    },
  },
};

const client = new LighthouseClient(clientConfig);
const params = {
  "InstanceIds": [
    "lhins-5XXXXX2"//轻量云ID        
  ]
};
const getTrafficPackage = async () => {
  const data = await client.DescribeInstancesTrafficPackages(params);
  const { TrafficUsed, TrafficPackageTotal, TrafficPackageRemaining } = data['InstanceTrafficPackageSet'][0]['TrafficPackageSet'][0]
  const alarm = TrafficPackageTotal * 0.01;//阈值
  if (TrafficPackageRemaining < alarm) {
    exec('poweroff', function (error, stdout, stderr) { });
  }
  else {
    console.log(`总流量:${TrafficPackageTotal}`)
    console.log(`已使用:${TrafficUsed}\t${TrafficUsed / TrafficPackageTotal}`)
    console.log(`剩余量:${TrafficPackageRemaining}\t${TrafficPackageRemaining / TrafficPackageTotal}`)
    setTimeout(() => {
      getTrafficPackage()
    }, 1000 * 60 * 10)//10分钟执行一次
  }

}
getTrafficPackage();