create function increment_participation_count_by_one(event_actions_id int)
returns void as
$$
  update event_actions
  set number_participants = number_participants + 1
  where id = event_actions_id;
$$
language sql volatile;