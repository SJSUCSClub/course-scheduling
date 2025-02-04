import { Btn, Card } from '@/components/atoms';
import { PaginationBar, SearchBar } from '@/components/molecules';
import { AdminList } from '@/types/admin';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import dayjs from 'dayjs';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useCookies } from 'react-cookie';
import useSWR from 'swr';

export const Manage: React.FC = () => {
  const [cookies] = useCookies(['csrftoken']);

  // search
  const searchParams = useSearchParams();
  const urlSearchParams = new URLSearchParams();
  const query = searchParams.get('query');
  if (query != null) {
    urlSearchParams.set('query', query);
  }
  urlSearchParams.set('limit', '3');
  const page = searchParams.get('page') ?? '1';
  urlSearchParams.set('page', page);
  const { data, mutate } = useSWR<AdminList>(
    `/django/admin/list?${urlSearchParams.toString()}`,
  );

  // handle delete
  const handleDelete = async (user_id: string) => {
    await fetch('/django/admin/manage-moderator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': cookies.csrftoken,
      },
      body: JSON.stringify({ action: false, user_id: user_id }),
    });
    mutate(data);
  };

  // handle add
  const [error, setError] = React.useState(false);
  const handleAdd = async () => {
    await fetch('/django/admin/manage-moderator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': cookies.csrftoken,
      },
      body: JSON.stringify({
        user_id: query || '',
        action: true,
      }),
    }).then((resp) => {
      console.log(resp.status);
      setError(resp.status == 500);
    });
    mutate(data);
  };

  return (
    <section className="mx-auto w-full max-w-content-width px-md">
      <h1 className="pb-md max-lg:text-h3-mobile lg:text-h3-desktop">
        Current Moderators
      </h1>

      <div className="flex w-full flex-row gap-[20px] pb-md">
        <SearchBar className="w-full" />
        <Btn
          variant="primary"
          className="flex flex-row"
          popoverTarget="add-status"
          onClick={handleAdd}
        >
          <PlusIcon
            width={20}
            height={20}
            className="flex h-full items-center"
          />
          Add
        </Btn>
      </div>

      {/* Add status dialog */}
      <dialog
        popover="auto"
        id="add-status"
        className="bg-[#00000000] backdrop:bg-text backdrop:opacity-25"
      >
        <Card className="flex w-[300px] flex-col p-md">
          {!error ? (
            <p>Moderator added successfully.</p>
          ) : (
            <p>Failed to add moderator.</p>
          )}
          <div className="flex flex-row pt-md">
            <Btn variant="primary" popoverTarget="add-status">
              Close
            </Btn>
          </div>
        </Card>
      </dialog>

      {/* table, but using flexboxes */}
      <div className="flex w-full flex-col pb-2 text-text">
        <Card>
          <menu>
            <li className="flex flex-row border-b-2 px-4 py-2 font-bold">
              <p className="w-1/3">User ID</p>
              <p className="w-1/3">Role</p>
              <p className="w-1/3">Created At</p>
            </li>
            {data?.items && data.items.length > 0 ? (
              data?.items.map((val, idx) => (
                <>
                  <dialog
                    popover="auto"
                    id={`remove-admin-${val.user_id}`}
                    className="bg-[#00000000] backdrop:bg-text backdrop:opacity-25"
                  >
                    <Card className="flex w-[300px] flex-col p-md">
                      <p>Are you sure you want to remove this Moderator?</p>
                      <div className="flex w-full flex-row gap-sm pt-md">
                        <Btn
                          variant="primary"
                          className="!bg-important text-background"
                          popoverTarget={`remove-admin-${val.user_id}`}
                          onClick={async () => handleDelete(val.user_id)}
                        >
                          Yes
                        </Btn>
                        <Btn
                          className="bg-background text-primary"
                          variant="primary"
                          popoverTarget={`remove-admin-${val.user_id}`}
                        >
                          No
                        </Btn>
                      </div>
                    </Card>
                  </dialog>
                  <li
                    key={idx}
                    className="flex flex-row border-b-2 px-4 py-2 animation last:border-b-0 hover:bg-[rgb(var(--color-primary)/0.15)] focus:bg-[rgb(var(--color-primary)/0.15)]"
                  >
                    <p className="w-1/3">{val.user_id}</p>
                    <p className="w-1/3">{val.admin_role}</p>
                    <p className="w-1/6">
                      {dayjs(val.created_at).format('MMM D, YYYY')}
                    </p>
                    {val.admin_role === 'Moderator' && (
                      <div className="flex w-1/6 items-center justify-center">
                        <button
                          className="flex h-full w-min items-center p-1 transition-all duration-100 ease-in-out hover:opacity-75"
                          popoverTarget={`remove-admin-${val.user_id}`}
                        >
                          <XMarkIcon width={16} height={16} />
                        </button>
                      </div>
                    )}
                  </li>
                </>
              ))
            ) : (
              <li className="px-4 py-2 text-center">
                No results found. You can add this administrator or try changing
                your search.
              </li>
            )}
          </menu>
        </Card>
      </div>

      <div className="flex w-full justify-center">
        <PaginationBar totalPages={data?.pages ?? 0} />
      </div>
    </section>
  );
};
