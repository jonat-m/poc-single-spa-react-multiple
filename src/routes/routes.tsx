import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense } from "react";

import { action as destroyAction } from "../routes//contacts/destroy";
import Contact, {
  action as contactAction,
  loader as contactLoader,
} from "../pages/contact";
import EditContact, { action as editAction } from "../pages/edit";
import ErrorPage from "../pages/error-page";
import Index from "../routes/index";
import Root, {
  action as rootAction,
  loader as rootLoader,
} from "../pages/dashboard";

const router = createBrowserRouter(
  [
    {
      action: rootAction,
      children: [
        {
          element: (
            <Suspense fallback={<div>Loading</div>}>
              <Index />
            </Suspense>
          ),
          index: true,
        },
        {
          action: contactAction,
          element: (
            <Suspense fallback={<div>Loading</div>}>
              <Contact />
            </Suspense>
          ),
          loader: contactLoader,
          path: "/contacts/:contactId",
        },
        {
          action: editAction,
          element: (
            <Suspense fallback={<div>Loading</div>}>
              <EditContact />
            </Suspense>
          ),
          loader: contactLoader,
          path: "/contacts/:contactId/edit",
        },
        {
          action: destroyAction,
          errorElement: <div>Oops! There was an error.</div>,
          path: "/contacts/:contactId/destroy",
        },
      ],
      element: <Root />,
      errorElement: <ErrorPage />,
      loader: rootLoader,
      path: "/",
    },
  ],
  { basename: "/react-multiple" }
);

export default function Routes() {
  return <RouterProvider router={router} />;
}
