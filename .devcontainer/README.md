# Development Container for Jekyll GitHub Pages

此 devcontainer 配置为 Jekyll GitHub Pages 网站开发提供了完整的开发环境。

## 功能

- Ruby 2.7 环境（与 GitHub Pages 兼容）
- 预装 Jekyll 和相关依赖
- VS Code 扩展配置（Markdown、YAML、CSS 等）
- 自动端口转发（4000 端口）
- 开发工具和实用程序

## 使用方法

1. 确保安装了 VS Code 和 Dev Containers 扩展
2. 在 VS Code 中打开项目
3. 当提示时，选择 "Reopen in Container" 或使用命令面板：
   - `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (macOS)
   - 搜索 "Dev Containers: Reopen in Container"

## 开发命令

容器启动后，你可以使用以下命令：

```bash
# 安装依赖（如果需要）
bundle install

# 启动 Jekyll 开发服务器
bundle exec jekyll serve --host 0.0.0.0 --livereload

# 或者使用项目中的脚本（如果存在）
./run_server.sh
```

## 端口

- **4000**: Jekyll 开发服务器

## 包含的 VS Code 扩展

- JSON 支持
- YAML 支持  
- Tailwind CSS 智能感知
- CSS Peek
- 自动重命名标签
- HTML 预览
- Markdown All in One
- Markdown Lint
- 拼写检查

## 环境变量

- `BUNDLE_PATH`: `/usr/local/bundle`

## 注意事项

- 容器使用 root 用户以简化权限管理
- 项目文件通过 bind mount 挂载，确保文件更改持久化
- 使用 cached 一致性模式以在 macOS/Windows 上获得更好的性能