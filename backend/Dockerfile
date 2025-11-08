# ---------- 1) Build stage ----------
FROM golang:1.25.1-alpine AS build
WORKDIR /src
RUN apk add --no-cache ca-certificates git

COPY go.mod go.sum ./
RUN go mod download

COPY . .

ENV CGO_ENABLED=0 GOOS=linux
RUN go build -ldflags="-s -w" -o /out/app ./cmd

# ---------- 2) Runtime stage ----------
FROM alpine:3.20
RUN apk add --no-cache ca-certificates tzdata
RUN adduser -D -u 10001 appuser
USER appuser

WORKDIR /app
COPY --from=build /out/app /app/app

EXPOSE 8080
ENTRYPOINT ["/app/app"]
