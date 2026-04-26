# AGENTS

이 저장소에서 RN 코드를 작성하거나 수정할 때는 아래 순서를 따른다.

1. `PROJECT_HARNESS.md`를 읽고 RN 범위와 금지사항을 확인한다.
2. `API_SPEC.md`를 읽고 REST/WS contract, enum, 에러 형식을 확인한다.
3. UI 코드나 스타일 코드를 작성하기 전에 반드시 `design.md`를 먼저 읽는다.

추가 규칙:

- 색상, 배경, 텍스트 컬러, 보더 컬러는 `design.md` 기준을 우선 사용한다.
- `design.md`에 없는 색을 임의로 추가하기 전에 기존 토큰으로 해결 가능한지 먼저 확인한다.
- API 필드명, enum, WebSocket 이벤트명은 `API_SPEC.md`와 다르게 임의 작성하지 않는다.
- RN 구현은 `PROJECT_HARNESS.md`에 정의된 범위를 넘기지 않는다.
