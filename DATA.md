# Addis Eats Data Strategy

## Menu

**Key:** `/api/dishes`

**Strategy:** Server Components for server-owned initial data; SWR for interactive menu fetching.

**Reason:** Server Components can render initial data without requiring browser-side fetching. SWR supports caching and revalidation for interactive menu features.

## Menu Search

**Key:** `/api/dishes?q={query}`

**Strategy:** SWR with a 300ms debounce and `keepPreviousData`.

**Reason:** Search depends on user input. Debouncing reduces unnecessary requests, while previous results can remain visible during updates.

## Menu Pagination

**Key:** `/api/dishes?page={page}`

**Strategy:** SWR with `keepPreviousData`.

**Reason:** The page number identifies a different result set and should be included in the request key.

## Order Status

**Key:** `/api/orders/status` (current demo implementation)

**Strategy:** SWR with polling every 5 seconds.

**Reason:** Order status may change while the page remains open, so periodic revalidation can retrieve updates.

**Future improvement:** Use `/api/orders/{id}` and pass server-rendered order data to the Client Component using `fallbackData`.

## Cart

**Key:** `/api/cart` (planned if not yet implemented)

**Strategy:** SWR or TanStack Query.

**Refresh:** Revalidate after a successful cart mutation.

**Reason:** The cached cart should reflect successful changes made by the user.

## TanStack Query

**Menu query key:** `["dishes"]`

**Strategy:** `useQuery` for fetching and `useMutation` for submitting a new dish.

**Cache configuration:** `staleTime: 30 seconds`; `gcTime: 5 minutes`.

**Refresh after mutation:** `queryClient.invalidateQueries({ queryKey: ["dishes"] })`.

**Current limitation:** The demo add-dish API does not persist new dishes, so the added dish will not remain in the menu after a fresh fetch.

## Future Improvements

- Pass server-rendered menu and order data to Client Components.
- Implement dynamic order routes with `await params`.
- Combine search and pagination in the API so filtering applies across all pages.
- Persist dish and cart changes in a database or another suitable storage system.
- Add tests for loading, error, polling, search, pagination, and mutation behavior.