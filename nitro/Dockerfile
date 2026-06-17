FROM public.ecr.aws/docker/library/alpine:3.20

WORKDIR /app

# Conceptual packaging only. The production image would mount or copy the verifier binary.
COPY enclave-entrypoint.sh /app/enclave-entrypoint.sh
COPY vsock-request.example.json /app/vsock-request.example.json

RUN chmod +x /app/enclave-entrypoint.sh

ENTRYPOINT ["/app/enclave-entrypoint.sh"]
