/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUI_NETWORK?: string;
  readonly VITE_PACKAGE_ID?: string;
  readonly VITE_MINT_REGISTRY_ID?: string;
  readonly VITE_REGISTRY_OBJECT_ID?: string;
  readonly VITE_RANDOM_OBJECT_ID?: string;
  readonly VITE_EVENT_NAME?: string;
  readonly VITE_IMAGE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
