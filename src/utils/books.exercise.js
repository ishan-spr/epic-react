import { useQuery } from "react-query/dist/react-query.development"
import { client } from "./api-client.exercise"
import bookPlaceholderSvg from 'assets/book-placeholder.svg'

const loadingBook = {
    title: 'Loading...',
    author: 'loading...',
    coverImageUrl: bookPlaceholderSvg,
    publisher: 'Loading Publishing',
    synopsis: 'Loading...',
    loadingBook: true,
}

const loadingBooks = Array.from({ length: 10 }, (v, index) => ({
    id: `loading-book-${index}`,
    ...loadingBook,
}))


function useBookSearch(query, user) {
    const result = useQuery({
        queryKey: ['bookSearch', { query }],
        queryFn: () =>
            client(`books?query=${encodeURIComponent(query)}`, {
                token: user.token,
            }).then(data => data.books),
    })
    return { ...result, books: result.data ?? loadingBooks }
}

function useBook(bookId, user) {
    const result = useQuery({
        queryKey: ['book', { bookId }],
        queryFn: () =>
            client(`books/${bookId}`, { token: user.token }).then(data => data.book),
    })
    return result ?? loadingBook
}

export { useBookSearch, useBook }
