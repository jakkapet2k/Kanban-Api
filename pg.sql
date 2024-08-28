

CREATE TABLE public.board_members (
    id SERIAL PRIMARY KEY,
    board_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    role VARCHAR(50)
);


CREATE TABLE public.boards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE public.columns (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    board_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.invitations (
    id SERIAL PRIMARY KEY,
    board_id INTEGER NOT NULL,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    status VARCHAR(50)
);


CREATE TABLE public.tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);


CREATE TABLE public.task_tags (
    task_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (task_id, tag_id)
);


CREATE TABLE public.tasks (
    id SERIAL PRIMARY KEY,
    content VARCHAR(255) NOT NULL,
    description TEXT,
    column_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.board_members
    ADD CONSTRAINT board_members_board_id_fkey FOREIGN KEY (board_id) REFERENCES public.boards(id);

ALTER TABLE public.board_members
    ADD CONSTRAINT board_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

ALTER TABLE public.boards
    ADD CONSTRAINT boards_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.columns
    ADD CONSTRAINT columns_board_id_fkey FOREIGN KEY (board_id) REFERENCES public.boards(id) ON DELETE CASCADE;

ALTER TABLE public.invitations
    ADD CONSTRAINT invitations_board_id_fkey FOREIGN KEY (board_id) REFERENCES public.boards(id);

ALTER TABLE public.task_tags
    ADD CONSTRAINT task_tags_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;

ALTER TABLE public.tasks
    ADD CONSTRAINT tasks_column_id_fkey FOREIGN KEY (column_id) REFERENCES public.columns(id) ON DELETE CASCADE;
