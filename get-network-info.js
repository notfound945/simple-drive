#!/usr/bin/env node

import os from 'os';

function getNetworkInterfaces() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  
  for (const [name, iface] of Object.entries(interfaces)) {
    if (!iface) continue;
    
    for (const alias of iface) {
      // 跳过内部地址和 IPv6 地址
      if (alias.family === 'IPv4' && !alias.internal) {
        addresses.push({
          interface: name,
          address: alias.address,
          port: process.env.PORT || 3000
        });
      }
    }
  }
  
  return addresses;
}

function displayAddresses() {
  const addresses = getNetworkInterfaces();
  const port = process.env.PORT || 3000;
  
  console.log('\n🌐 可访问地址:');
  console.log('========================================');
  
  if (addresses.length === 0) {
    console.log('❌ 未找到可用的网络接口');
    return;
  }
  
  // 显示 localhost
  console.log(`📱 本地访问: http://localhost:${port}`);
  console.log(`📱 本地访问: http://127.0.0.1:${port}`);
  
  // 显示所有网络接口
  addresses.forEach(({ interface: iface, address }) => {
    console.log(`🌍 网络访问: http://${address}:${port} (${iface})`);
  });
  
  console.log('========================================\n');
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  displayAddresses();
}

export { getNetworkInterfaces, displayAddresses };
