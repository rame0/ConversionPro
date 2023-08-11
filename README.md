

## Project setup

```bash
pnpm install
```

### Compiles and hot-reloads for development

```bash
pnpm run dev
```

### Compiles and minifies for production

```bash
pnpm run build
```


## Docker
```shell
docker build --tag=conversion-pro .

docker run -d --rm -p "8080:8080" --volume ./data/:/app/data conversion-pro

```
