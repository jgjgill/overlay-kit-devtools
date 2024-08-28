# overlay-kit-devtools

> Chrome extensions based on toss/overlay-kit devtools. (unofficial devtools)

## 소개

[`toss/overlay-kit`](https://github.com/toss/overlay-kit)을 기반으로 한 크롬 확장 devtools이에요.

현재 실험 단계 플러그인으로 직접 사용하기 위해서는 몇 가지 작업이 필요해요.

만약 해당 플러그인을 테스트해보고 싶으시면 [설정](https://github.com/jgjgill/overlay-kit-devtools?tab=readme-ov-file#%EC%84%A4%EC%A0%95)을 확인해 주세요.

## 소개

`overlay-kit`을 사용하면서 많은 편리함과 장점들을 느낄 수 있었어요.

하지만 처음 라이브러리를 적응하는 과정에서는 몇 가지 이해도를 높이는 과정이 필요했고 이 과정에서 **편리한 디버깅 환경**의 필요성을 느꼈어요.

- 중복된 `id`로 `overlay`를 생성할 수 없어요.
- `unmount`와 달리 `close`는 `DOM`에서 제거되지 않아요.

실제로 라이브러리를 사용할 때에도 `overlay`의 **데이터를 디버깅**하는 과정이 필요했어요.

여기서 라이브러리에서 제공해주는 `useOverlayData` 훅을 사용하면 되지만 필요할 때마다 호출하고 제거하는 과정이 번거롭게 느껴졌어요.

이렇게 불편한 점들을 느끼면서 디버깅과 관련된 부분을 개선하면 좋겠다는 생각을 하게 되었어요.

그러면서 떠오르게 된 것이 크롬 확장을 활용한 `overlay-kit-devtools`이에요.

해당 라이브러리를 만들게 된 주요 아이디어는 [usefunnel - Funnel Debugger](https://youtu.be/NwLWX2RNVcw?feature=shared&t=713)에서 얻었어요.

## 기능

- `currentId`, `overlayList` 시각화
- `currentId`를 기반으로 현재 overlay 스타일 구분
- `devtools`을 통한 `overlay` 제거

## 설정

`overlay-kit-devtools`는 `overlay-kit` 라이브러리와 데이터 통신을 위해 `customEvent`을 활용해요.

그래서 `overlay-kit` 라이브러리 내부 코드에 다음 코드를 추가해 주세요.

**provider.tsx**

```tsx
  useEffect(() => {
    const overlayList = overlayState.overlayOrderList.map((item) => {
      const { id, isOpen } = overlayState.overlayData[item];
      return { id, isOpen };
    });

    const event = new CustomEvent('sendToExtension', { detail: { overlayList, currentId: overlayState.current } });
    window.dispatchEvent(event);
  }, [overlayState]);

  useEffect(() => {
    const handleCustomEvent = (event: CustomEvent) => {
      dispatchOverlay({ type: 'REMOVE', overlayId: event.detail });
    };

    window.addEventListener('sendToApp', handleCustomEvent as EventListener);

    return () => {
      window.removeEventListener('sendToApp', handleCustomEvent as EventListener);
    };
  }, []);
```

`overlay-kit-devtools`의 경우 아직 chrome 웹 스토어에 존재하지 않아요.

그래서 배포된 소스 코드를 사용자 크롬 확장 프로그램에 직접 추가해주는 과정이 필요해요.

[`releases`](https://github.com/jgjgill/overlay-kit-devtools/releases)된 소스 코드를 받거나 해당 깃허브 소스 코드를 클론해 주세요.

그 다음 해당 명령어들을 입력해 주세요.

```bash
yarn
yarn build
```

그러면 `dist` 폴더가 생성돼요.

그 다음 크롬의 확장프로그램 관리로 이동해요.

> chrome://extensions/

<img width="1439" alt="스크린샷 2024-08-28 오전 12 09 27" src="https://github.com/user-attachments/assets/eaa18d8f-601d-4198-ad7c-5d93f2556ef6">

`압축해제된 확장 프로그램을 로드합니다.` -> `dist` 폴더 선택

<img width="1115" alt="스크린샷 2024-08-28 오전 12 12 45" src="https://github.com/user-attachments/assets/4aa46f38-63e6-4740-9a6a-d9120f927c68">

확장프로그램이 정상적으로 추가된 것을 확인할 수 있어요.

<img width="339" alt="스크린샷 2024-08-28 오전 12 14 44" src="https://github.com/user-attachments/assets/fd5a00bf-7483-4c45-a632-a2dbcd4a2c78">

## 예시

https://github.com/user-attachments/assets/d7158967-b50b-414c-93af-514de0c211f7
