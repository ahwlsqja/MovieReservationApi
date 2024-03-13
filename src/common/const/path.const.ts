import { join } from "path";
// .env 
export const PROJECT_ROOT_PATH = process.cwd();
export const PROJECT_ROOT_2ND_PATH = 'nest-project'
export const PUBLIC_FOLDER_NAME = 'public';
export const SHOWS_FOLDER_NAME = 'shows'
//임시 폴더
export const TEMP_FOLDER_NAME = 'temp';

// 실제 프로젝트 절대 경로
export const PUBLIC_FOLDER_PATH = join(
    PROJECT_ROOT_PATH,
    PROJECT_ROOT_2ND_PATH,
    PUBLIC_FOLDER_NAME,
)

export const SHOWS_IMAGE_PATH = join(
    PUBLIC_FOLDER_PATH,
    SHOWS_FOLDER_NAME,
)

export const SHOW_PUBLIC_IMAGE_PATH = join(
    PUBLIC_FOLDER_NAME,
    SHOWS_FOLDER_NAME,
)

// 임시 파일 들을 저장할 폴더
// {프로젝트 경로}/temp
export const TEMP_FOLDER_PATH = join(
    PUBLIC_FOLDER_PATH,
    TEMP_FOLDER_NAME,
)