import copy
import json
import unittest
from verify_results import DEFAULT, verify


class ReplayChecks(unittest.TestCase):
    def setUp(self):
        self.data = json.loads(DEFAULT.read_text())

    def test_complete_dataset(self):
        self.assertEqual(verify(self.data)['arithmetic_rows'], 256)

    def test_refusals(self):
        def remove_actual(data):
            del data['results'][0]['actual']
        mutations = [
            lambda d: d['results'].pop(),
            lambda d: d['results'][0].update(actual=1),
            lambda d: d['results'][0].update(actual=0.5),
            lambda d: d['results'][0].update(actual=False),
            remove_actual,
            lambda d: d['results'][1].update(case=0),
            lambda d: d['results'][0].update(case=256),
            lambda d: d['results'][0].update(w_u64_hex='ffffffffffffffff'),
            lambda d: d['results'][0].update(w_u64_hex='0'),
            lambda d: d.update(encoding={'0': 1, '1': 0, '2': -1}),
            lambda d: d.update(lanes=True),
            lambda d: d['results'].__setitem__(0, None),
        ]
        for mutate in mutations:
            data = copy.deepcopy(self.data)
            mutate(data)
            with self.subTest(mutation=mutations.index(mutate)):
                with self.assertRaises(ValueError):
                    verify(data)


if __name__ == '__main__':
    unittest.main()
