# BUG-013: Deep Investigation - RUN_STARTED Still Failing

## Status: FIXED

## Error Message
```
Agent execution failed: Error: First event must be 'RUN_STARTED'
```

## Root Cause Analysis

### Previous Fix Attempt (f1968a1) - Why It Failed

The previous fix attempted to emit `RUN_STARTED` synchronously before returning the Observable:

```typescript
run(input: RunAgentInput): Observable<BaseEvent> {
    const subject = new Subject<BaseEvent>();
    subject.next(runStartedEvent);  // <-- Emits BEFORE subscription!
    // ...
    return subject.asObservable();
}
```

### Why This Didn't Work

**RxJS Subject does NOT buffer events.** Events emitted before any subscriber exists are LOST.

The execution flow in CopilotKit's AbstractAgent:
1. `runAgent()` calls `this.run(input)` which returns an Observable
2. `this.run()` emits RUN_STARTED via `subject.next()` - **but no one is subscribed yet!**
3. `runAgent()` applies transforms via `.pipe(transformChunks, verifyEvents, ...)`
4. `runAgent()` subscribes via `lastValueFrom()`
5. `verifyEvents` expects the FIRST event to be RUN_STARTED - **but it was already lost!**

### How BuiltInAgent Does It Correctly

BuiltInAgent uses `new Observable((subscriber) => {...})`:

```typescript
run(input) {
    return new Observable((subscriber) => {
        subscriber.next(startEvent);  // <-- Emits WHEN subscribed
        // ...
    });
}
```

The callback inside `new Observable()` runs **when subscribed**, not when the Observable is created.

### The Fix

Changed from Subject pattern to Observable constructor pattern:

```typescript
run(input: RunAgentInput): Observable<BaseEvent> {
    return new Observable<BaseEvent>((subscriber) => {
        // This runs when subscribed, so RUN_STARTED goes to verifyEvents correctly
        subscriber.next(runStartedEvent);
        // ...
    });
}
```

## Technical Details

### Error Location
File: `node_modules/@ag-ui/client/dist/index.mjs`
Function: `verifyEvents` (minified as `z`)

```javascript
if(r=!0,v!==w.RUN_STARTED&&v!==w.RUN_ERROR)
    return O(()=>new L("First event must be 'RUN_STARTED'"));
```

### Pipeline Flow
```
agent.run() -> transformChunks (j) -> verifyEvents (z) -> ...
```

The `transformChunks` uses `mergeMap` (asynchronous), but the issue was events being lost before the Observable was even subscribed to.

## Files Modified
- `lib/steertrue-agent.ts` - Changed from `Subject` to `Observable` constructor pattern

## Testing Required
Deploy to Railway and test chat functionality to verify RUN_STARTED is now received correctly.

## Lesson Learned
**RxJS Subject vs Observable constructor:**
- `Subject.next()` - Emits immediately, lost if no subscriber
- `new Observable((subscriber) => subscriber.next(...))` - Emits when subscribed

For agents that need to emit events on subscription, always use the Observable constructor pattern.
