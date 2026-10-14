// Minimal bridge between JS promises and Kotlin coroutines, avoiding a kotlinx.coroutines dependency

import kotlin.coroutines.Continuation
import kotlin.coroutines.EmptyCoroutineContext
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
import kotlin.coroutines.startCoroutine
import kotlin.coroutines.suspendCoroutine
import kotlin.js.Promise

suspend fun <T> Promise<T>.await(): T = suspendCoroutine { continuation ->
    then({ continuation.resume(it) }, { continuation.resumeWithException(it) })
}

fun <T> async(block: suspend () -> T): Promise<T> = Promise { resolve, reject ->
    block.startCoroutine(Continuation(EmptyCoroutineContext) { result -> result.fold(resolve, reject) })
}

fun launch(block: suspend () -> Unit) {
    async(block).catch { console.error("Unhandled error:", it) }
}
