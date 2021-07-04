# tencloudstatus

### 腾讯云轻量应用服务器流量检测

> 使用 
> 
```
npm i
node app.js
```

> 开机自启 
> 
```
npm i pm2  #安装pm2工具

pm2 start app.js
pm2 save
pm2 startup
systemctl enable pm2-root
```