// comment_with_function_test 출처 https://github.com/python/cpython/blob/main/Include/dynamic_annotations.h

#ifndef __DYNAMIC_ANNOTATIONS_H__
#define __DYNAMIC_ANNOTATIONS_H__

#ifndef DYNAMIC_ANNOTATIONS_ENABLED
#define DYNAMIC_ANNOTATIONS_ENABLED 0
#endif

#if DYNAMIC_ANNOTATIONS_ENABLED != 0

/* -------------------------------------------------------------
   Annotations useful when implementing condition variables such as CondVar,
   using conditional critical sections (Await/LockWhen) and when constructing
   user-defined synchronization mechanisms.

   The annotations _Py_ANNOTATE_HAPPENS_BEFORE() and
   _Py_ANNOTATE_HAPPENS_AFTER() can be used to define happens-before arcs in
   user-defined synchronization mechanisms: the race detector will infer an
   arc from the former to the latter when they share the same argument
   pointer.

   Example 1 (reference counting):

   void Unref() {
     _Py_ANNOTATE_HAPPENS_BEFORE(&refcount_);
     if (AtomicDecrementByOne(&refcount_) == 0) {
       _Py_ANNOTATE_HAPPENS_AFTER(&refcount_);
       delete this;
     }
   }

   Example 2 (message queue):

   void MyQueue::Put(Type *e) {
     MutexLock lock(&mu_);
     _Py_ANNOTATE_HAPPENS_BEFORE(e);
     PutElementIntoMyQueue(e);
   }

   Type *MyQueue::Get() {
     MutexLock lock(&mu_);
     Type *e = GetElementFromMyQueue();
     _Py_ANNOTATE_HAPPENS_AFTER(e);
     return e;
   }

   Note: when possible, please use the existing reference counting and message
   queue implementations instead of inventing new ones. */

/* Report that wait on the condition variable at address "cv" has succeeded
   and the lock at address "lock" is held. */
#define _Py_ANNOTATE_CONDVAR_LOCK_WAIT(cv, lock) \
    AnnotateCondVarWait(__FILE__, __LINE__, cv, lock)
