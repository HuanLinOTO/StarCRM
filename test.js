// 创建一个权限管理器类
class PermissionManager {
    // 构造函数，初始化用户组和权限节点的存储对象
    constructor() {
      this.groups = {}; // 用一个对象来存储用户组，键为组名，值为组对象
      this.nodes = {}; // 用一个对象来存储权限节点，键为节点名，值为节点对象
    }
   
    // 创建一个用户组的方法，接受一个组名作为参数
    createGroup(name) {
      // 检查组名是否已经存在
      if (this.groups[name]) {
        // 如果存在，抛出一个错误
        throw new Error(`Group ${name} already exists.`);
      } else {
        // 如果不存在，创建一个新的组对象
        let group = {
          name: name, // 组名
          permissions: [], // 权限列表，存储该组拥有的权限节点
          inherits: [], // 继承列表，存储该组继承的其他组
          weight: 0, // 权重，用来决定优先级
          meta: {}, // 元数据，用来存储一些额外的信息，如前缀后缀等
        };
        // 将新的组对象添加到用户组存储对象中
        this.groups[name] = group;
        // 返回新的组对象
        return group;
      }
    }
   
    // 删除一个用户组的方法，接受一个组名作为参数
    deleteGroup(name) {
      // 检查组名是否存在
      if (this.groups[name]) {
        // 如果存在，删除该组对象
        delete this.groups[name];
      } else {
        // 如果不存在，抛出一个错误
        throw new Error(`Group ${name} does not exist.`);
      }
    }
   
    // 获取一个用户组的方法，接受一个组名作为参数
    getGroup(name) {
      // 检查组名是否存在
      if (this.groups[name]) {
        // 如果存在，返回该组对象
        return this.groups[name];
      } else {
        // 如果不存在，抛出一个错误
        throw new Error(`Group ${name} does not exist.`);
      }
    }
   
    // 设置一个用户组的权重的方法，接受一个组名和一个权重值作为参数
    setGroupWeight(name, weight) {
      // 获取该组对象
      let group = this.getGroup(name);
      // 设置该组的权重属性为权重值
      group.weight = weight;
    }
   
    // 设置一个用户组的元数据的方法，接受一个组名和一个键值对作为参数
    setGroupMeta(name, key, value) {
      // 获取该组对象
      let group = this.getGroup(name);
      // 设置该组的元数据对象中的键值对
      group.meta[key] = value;
    }
   
    // 添加一个用户组继承另一个用户组的方法，接受两个组名作为参数
    addGroupInherit(name, inherit) {
      // 获取两个组对象
      let group = this.getGroup(name);
      let parent = this.getGroup(inherit);
      // 检查是否已经继承过了
      if (group.inherits.includes(inherit)) {
        // 如果已经继承过了，抛出一个错误
        throw new Error(`Group ${name} already inherits group ${inherit}.`);
      } else {
        // 如果没有继承过了，将继承的组名添加到继承列表中
        group.inherits.push(inherit);
      }
    }
   
    // 移除一个用户组继承另一个用户组的方法，接受两个组名作为参数
    removeGroupInherit(name, inherit) {
      // 获取两个组对象
      let group = this.getGroup(name);
      let parent = this.getGroup(inherit);
      // 检查是否已经继承过了
      if (group.inherits.includes(inherit)) {
        // 如果已经继承过了，将继承的组名从继承列表中移除
        group.inherits = group.inherits.filter((g) => g !== inherit);
      } else {
        // 如果没有继承过了，抛出一个错误
        throw new Error(`Group ${name} does not inherit group ${inherit}.`);
      }
    }
   
    // 创建一个权限节点的方法，接受一个节点名和一个布尔值作为参数
    createNode(name, value) {
      // 检查节点名是否已经存在
      if (this.nodes[name]) {
        // 如果存在，抛出一个错误
        throw new Error(`Node ${name} already exists.`);
      } else {
        // 如果不存在，创建一个新的节点对象
        let node = {
          name: name, // 节点名
          value: value, // 节点值，表示许可或禁止
        };
        // 将新的节点对象添加到权限节点存储对象中
        this.nodes[name] = node;
        // 返回新的节点对象
        return node;
      }
    }
   
    // 删除一个权限节点的方法，接受一个节点名作为参数
    deleteNode(name) {
      // 检查节点名是否存在
      if (this.nodes[name]) {
        // 如果存在，删除该节点对象
        delete this.nodes[name];
      } else {
        // 如果不存在，抛出一个错误
        throw new Error(`Node ${name} does not exist.`);
      }
    }
   
    // 获取一个权限节点的方法，接受一个节点名作为参数
    getNode(name) {
      // 检查节点名是否存在
      if (this.nodes[name]) {
        // 如果存在，返回该节点对象
        return this.nodes[name];
      } else {
        // 如果不存在，抛出一个错误
        throw new Error(`Node ${name} does not exist.`);
      }
    }
   
    // 添加一个用户组拥有一个权限节点的方法，接受一个组名和一个节点名作为参数
    addGroupPermission(name, node) {
      // 获取两个对象
      let group = this.getGroup(name);
      let permission = this.getNode(node);
      // 检查是否已经拥有过了
      if (group.permissions.includes(node)) {
        // 如果已经拥有过了，抛出一个错误
        throw new Error(`Group ${name} already has node ${node}.`);
      } else {
        // 如果没有拥有过了，将节点名添加到权限列表中
        group.permissions.push(node);
      }
    }
   
    // 移除一个用户组拥有一个权限节点的方法，接受一个组名和一个节点名作为参数
    removeGroupPermission(name, node) {
      // 获取两个对象
      let group = this.getGroup(name);
      let permission = this.getNode(node);
      // 检查是否已经拥有过了
      if (group.permissions.includes(node)) {
        // 如果已经拥有过了，将节点名从权限列表中移除
        group.permissions = group.permissions.filter((n) => n !== node);
      } else {
        // 如果没有拥有过了，抛出一个错误
        throw new Error(`Group ${name} does not have node ${node}.`);
      }
    }
   
    // 检查一个用户组是否拥有一个权限节点的方法，接受一个组名和一个节点名作为参数，返回一个布尔值表示结果
    checkGroupPermission(name, node) {
      // 获取两个对象
      let group = this.getGroup(name);
      let permission = this.getNode(node);
      // 定义一个结果变量，默认为 false
      let result = false;
      // 遍历该组的权限列表，检查是否有匹配的节点名或通配符（* 表示所有）
      for (let p of group.permissions) {
        if (p === node || p === "*") {
          // 如果有匹配的，根据节点值设置结果变量，并跳出循环（优先级最高）
          result = permission.value;
          break;
        }
      }
      // 如果结果变量仍为 false，遍历该组的继承列表，递归地检查是否有继承的组拥有该节点
      if (!result) {
        for (let i of group.inherits) {
          // 如果有继承的组拥有该节点，根据节点值设置结果变量，并跳出循环（优先级次之）
          if (this.checkGroupPermission(i, node)) {
            result = permission.value;
            break;
          }
        }
      }
      // 返回结果变量
      return result;
    }
  }
   
  // 创建一个权限管理器实例
  let pm = new PermissionManager();
   
  // 创建一些用户组和权限节点
  pm.createGroup("default");
  pm.createGroup("vip");
  pm.createGroup("admin");
  pm.createNode("essentials.*", true);
  pm.createNode("essentials.fly", true);
  pm.createNode("essentials.heal", true);
  pm.createNode("essentials.kick", true);
  pm.createNode("essentials.ban", true);
  pm.createNode("*", true);
   
  // 设置一些用户组的权重和元数据
  pm.setGroupWeight("default", 0);
  pm.setGroupWeight("vip", 10);
  pm.setGroupWeight("admin", 100);
  pm.setGroupMeta("default", "prefix", "[默认]");
  pm.setGroupMeta("vip", "prefix", "[VIP]");
  pm.setGroupMeta("admin", "prefix", "[管理员]");
   
  // 添加一些用户组的权限和继承
  pm.addGroupPermission("default", "essentials.*");
  pm.addGroupPermission("vip", "essentials.heal");
  pm.addGroupPermission("admin", "*");
  pm.addGroupInherit("vip", "default");
  pm.addGroupInherit("admin", "vip");
   
  // 检查一些用户组的权限
  console.log(pm.checkGroupPermission("default", "essentials.fly")); // true
  console.log(pm.checkGroupPermission("default", "essentials.heal")); // false
  console.log(pm.checkGroupPermission("vip", "essentials.fly")); // true
  console.log(pm.checkGroupPermission("vip", "essentials.heal")); // true
  console.log(pm.checkGroupPermission("admin", "essentials.fly")); // true
  console.log(pm.checkGroupPermission("admin", "essentials.kick")); // true