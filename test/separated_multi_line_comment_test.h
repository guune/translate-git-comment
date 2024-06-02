// 주석이 여러줄에 있을때 출처 https://github.com/python/cpython/blob/main/Include/dynamic_annotations.h

/* Report that wait on the condition variable at address "cv" has succeeded
   and the lock at address "lock" is held. */
#define _Py_ANNOTATE_CONDVAR_LOCK_WAIT(cv, lock) \
    AnnotateCondVarWait(__FILE__, __LINE__, cv, lock)

/* Report that wait on the condition variable at "cv" has succeeded.  Variant
   w/o lock. */
#define _Py_ANNOTATE_CONDVAR_WAIT(cv) \
    AnnotateCondVarWait(__FILE__, __LINE__, cv, NULL)

/* Report that we are about to signal on the condition variable at address
   "cv". */
#define _Py_ANNOTATE_CONDVAR_SIGNAL(cv) \
    AnnotateCondVarSignal(__FILE__, __LINE__, cv)

/* Report that we are about to signal_all on the condition variable at "cv". */
#define _Py_ANNOTATE_CONDVAR_SIGNAL_ALL(cv) \
    AnnotateCondVarSignalAll(__FILE__, __LINE__, cv)

/* Annotations for user-defined synchronization mechanisms. */
#define _Py_ANNOTATE_HAPPENS_BEFORE(obj) _Py_ANNOTATE_CONDVAR_SIGNAL(obj)
#define _Py_ANNOTATE_HAPPENS_AFTER(obj) _Py_ANNOTATE_CONDVAR_WAIT(obj)