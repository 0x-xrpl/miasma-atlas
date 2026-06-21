FROM public.ecr.aws/docker/library/alpine:3.20

WORKDIR /app

# Conceptual packaging only. The production image would mount or copy the verifier binary.
ARG NITRO_ENCLAVE_MODE=verify
ENV NITRO_ENCLAVE_MODE=${NITRO_ENCLAVE_MODE}

COPY attest.sh /app/attest.sh
COPY enclave-entrypoint.sh /app/enclave-entrypoint.sh
COPY vsock-request.example.json /app/vsock-request.example.json

RUN chmod +x /app/attest.sh /app/enclave-entrypoint.sh

ENTRYPOINT ["/app/enclave-entrypoint.sh"]
