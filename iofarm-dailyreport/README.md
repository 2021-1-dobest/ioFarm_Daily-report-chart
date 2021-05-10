# 프로젝트 : ioFarm-Dailyreport

## 패키지 구조

### `./public/*`

각종 public 파일들이 위치합니다.

### `./src/components/*`

앱에서 사용되는 큰 부분 이 존재합니다. 예시 :
- 네비게이션
- 좌측 네비게이션
- 하단, 상단 앱바
- 주 화면

### `./src/containers/*`

컴포넌트에서 사용되는 요소 중 특정 기능을 위해 하나로 패킹된 요소입니다. 
예시 :
- 차트 카드
- 차트 설정 모달

### `./src/res/*`

각종 정적 자원들이 위치한 폴더입니다.
여기 일부 폴더들은 download.txt 파일만 존재하는데 여기서는 해당 텍스트 문서의 링크를 따라 직접 다운로드가
필요합니다. 대부분 라이선스상의 이유로 이렇게 되었습니다.

### `./src/store/*`

전역 변수와 이를 저장하기 위한 관리용 API들이 모여있는 폴더입니다.
기본적으로 모두 redux와 관련있습니다.

## 기능 사용법

### 현지화

현지화 기능은 [i18next](https://www.i18next.com/), [i18next-react](https://react.i18next.com/) 를 통해 지원됩니다. 현지화 지원을 추가하기 위한 방법은
다음과 같습니다.

#### 주의 사항

- 적용을 위해서는 컴파일이 필요합니다.
- 비동기적인 로케일 로딩은 지원하지 않습니다.

#### 과정

1. `./src/res/locales/<언어 템플릿>.json`형태로 언어를 추가합니다. 이때 파일명은
   기본적으로 [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag) 형식을 사용하지만, 필수적인 조건은 아니고 필요한 파일명을 선택할 수
   있습니다.
1. `./src/i18n.js`파일을 엽니다. 이후
   ```javascript
   import 언어명 from "./src/res/locales/<언어 템플릿>.json"

   i18n
         .init({
            resources: {
                국가코드 : {
                    translation : 언어명
                }
            },
         });
   ```
   이 형태를 참조하여 새 언어를 추가합니다. 기존의 ko-KR, en-US 형태를 보는 것이 도움이 될 것입니다.

### 테마

#### 주의사항

- 적용을 위해서는 컴파일이 필요합니다.
- 비동기적인 테마 로딩은 지원하지 않습니다.

#### 과정

1. `./res/theme.json`을 엽니다.
1. json 파일을 수정합니다.

#### JSON 파일 구조

- `chart.label.*` : 차트 그리기를 위한 차트 색상의 종류입니다. 차트는 여기서 정의된 색만 사용 가능합니다.

  여기서 색을 추가 정의하기 위해서는 `chart.label.<색이름>.<색보조이름>`형태로 추가해야 합니다.

  색이름을 추가했을 경우 로케일 파일에 `contents.chart.label.<색이름>`을 별도로 추가하지 않으면 `<색이름>`을 그대로 출력합니다.
- `..mui` : 필드명이 `mui`라면 이는 createMuiTheme 함수에 사용되는 옵션입니다.

  여기에 들어갈 수 있는 값을 알고싶다면, [Theming](https://material-ui.com/customization/theming/) 을 참조하는 것이 도움이 될 것입니다.

### 설정

### 그 외

`./public/manifest.json` 파일을 변경합니다. 여기서 변경할 수 있는
것들은 [모질라-manifest.json](https://developer.mozilla.org/ko/docs/Mozilla/Add-ons/WebExtensions/manifest.json)
에 설명되어 있습니다.

대표적으로

- 브라우저 아이콘
- PWA 앱 패키징

등을 위해 사용 가능합니다.
