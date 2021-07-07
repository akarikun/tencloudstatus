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
    console.clear();
    console.log(`总流量:${(TrafficPackageTotal / 1024 / 1024 / 1024).toFixed(2)}GB\t查询时间:${new Date().toLocaleString()}`)
    console.log(`已使用:${(TrafficUsed == 0 ? 0 : TrafficUsed / 1024 / 1024 / 1024).toFixed(2)}GB\t百分比:${(TrafficUsed / TrafficPackageTotal).toFixed(2)}%`)
    console.log(`剩余量:${(TrafficPackageRemaining / 1024 / 1024 / 1024).toFixed(2)}GB\t百分比:${(TrafficPackageRemaining / TrafficPackageTotal).toFixed(2)}%`)
    setTimeout(() => {
      getTrafficPackage()
    }, 1000 * 60 * 10)//10分钟执行一次
  }
}
getTrafficPackage();
