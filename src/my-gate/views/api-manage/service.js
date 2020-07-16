import $axios from "../../../api";

export class UserClusterService {
    static async getUserCluster() {
        let data = await $axios.get('/admin/cluster/userClusters')
        return (data || []).map(i => ({label: i.name, value: i.code}))
    }
}
