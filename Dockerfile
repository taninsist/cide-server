# 构建阶段
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 生产阶段
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production

# 从构建阶段复制依赖和源代码
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]